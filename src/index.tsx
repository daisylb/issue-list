import { createClient, Provider } from "urql"
import React, { ReactElement, useState, useEffect, useMemo } from "react"
import { render } from "react-dom"
import {
  useGetRepoDataQuery,
  MilestoneInfoFragment,
  IssueInfoFragment,
} from "./graphql.gen"
import Authenticator from "netlify-auth-providers"

const auth = new Authenticator({})

type IssueProps = { issue: IssueInfoFragment }

function Issue(props: IssueProps): ReactElement | null {
  return (
    <div className="issue">
      <a href={props.issue.url}>{props.issue.title}</a>
      {props.issue.assignees.nodes?.map((x) => x && <small>{x.name}</small>)}
    </div>
  )
}

type MilestoneProps = { milestone: MilestoneInfoFragment }

function Milestone(props: MilestoneProps): ReactElement | null {
  return (
    <>
      <h2>{props.milestone.title}</h2>
      {props.milestone.issues.nodes?.map((x) =>
        x ? <Issue issue={x}></Issue> : null
      )}
    </>
  )
}

function MainView(props: {}): ReactElement | null {
  const [data] = useGetRepoDataQuery()
  return data.data?.repository ? (
    <>
      <h1>{data.data.repository?.nameWithOwner}</h1>
      {data.data.repository?.milestones?.nodes?.map?.((x) =>
        x ? <Milestone milestone={x}></Milestone> : null
      )}
    </>
  ) : (
    <div>{JSON.stringify(data)}</div>
  )
}

const ITEM_KEY = "githubAuthKey/read:user,repo"

type LoginProps = { onToken: (key: string) => void }

function Login(props: LoginProps): ReactElement | null {
  return (
    <button
      onClick={() =>
        auth.authenticate(
          { provider: "github", scope: "read:user,repo" },
          (err, data) => (err ? console.error(err) : props.onToken(data.token))
        )
      }
    >
      Log in with GitHub
    </button>
  )
}

function Wrapper(props: {}): ReactElement | null {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem(ITEM_KEY)
  )
  const client = useMemo(
    () =>
      token
        ? createClient({
            url: "https://api.github.com/graphql",
            fetchOptions: () => ({
              headers: {
                Authorization: `bearer ${token}`,
              },
            }),
          })
        : null,
    [token]
  )
  console.log("token", token, "client", client)
  return client ? (
    <Provider value={client}>
      <MainView></MainView>
    </Provider>
  ) : (
    <Login
      onToken={(t) => {
        localStorage.setItem(ITEM_KEY, t)
        setToken(t)
      }}
    ></Login>
  )
}

const c = document.createElement("div")
document.body.appendChild(c)
render(<Wrapper />, c)
