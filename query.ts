import { DocumentNode, ASTNode, TypeNameMetaFieldDef } from "graphql"

export const DATA = Symbol("DATA")
export type DATA = typeof DATA

export const VARIABLES = Symbol("VARIABLES")
export type VARIABLES = typeof VARIABLES

interface QVariable<TName extends string, TType extends string> {
  is: "QVariable"
  name: TName
  type: TType
}

function v<TName extends string, TType extends string>(
  name: TName,
  type: TType
): QVariable<TName, TType> {
  return { is: "QVariable", name: name, type: type }
}

interface QField<TName extends string> {
  is: "QField"
  name: TName
}

interface QNode<TASTNode extends ASTNode> {
  ast: ASTNode
}

export function query<T>(): DocumentNode {
  return {
    kind: "Document",
    definitions: [
      {
        kind: "OperationDefinition",
        operation: "query",
        selectionSet: {
          kind: "SelectionSet",
          selections: [
            { kind: "Field", name: { kind: "Name", value: "viewer" } },
          ],
        },
      },
    ],
  }
}

query({})
