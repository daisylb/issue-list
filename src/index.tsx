import { createClient, Provider } from "urql"
import React, { ReactElement } from "react"
import { render } from "react-dom"
import {
  useGetRepoDataQuery,
  MilestoneInfoFragment,
  IssueInfoFragment,
} from "./graphql.gen"

const client = createClient({
  url: "https://api.github.com/graphql",
  fetchOptions: () => ({
    headers: {
      Authorization: `bearer FIXME`,
    },
  }),
})

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
  return data.data ? (
    <>
      <h1>{data.data.repository?.nameWithOwner}</h1>
      {data.data.repository?.milestones?.nodes?.map?.((x) =>
        x ? <Milestone milestone={x}></Milestone> : null
      )}
    </>
  ) : null
}

function Wrapper(props: {}): ReactElement | null {
  return (
    <Provider value={client}>
      <MainView></MainView>
    </Provider>
  )
}

const c = document.createElement("div")
document.body.appendChild(c)
render(<Wrapper />, c)
