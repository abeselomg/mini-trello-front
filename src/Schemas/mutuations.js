import { gql } from "@apollo/client";

export const ADD_TASK = gql`
  mutation AddTask($listId: ID!,$dueDate:String!,$title:String!,$description:String!,$assignedUsers:[ID!]) {
    createTask(
      listId: $listId
      dueDate: $dueDate
      title: $title
      description: $description
      assignedUsers: $assignedUsers
    ) {
      task {
        taskId
        listId
        title
        description
        dueDate
        createdAt
        assignedUsers {
          userId
          name
        }
      }
    }
  }
`;


export const ADD_LIST = gql`
mutation AddList($boardId: ID!,$name:String!){
    createList(boardId:$boardId,name:$name){
      list{
        listId  
        name
      }
    }
  }
`;

export const MOVE_TASK = gql`
mutation AddList($taskId: ID!,$newListId:ID!,$listId:ID!){
    moveTaskToList(taskId:$taskId,newListId:$newListId,listId:$listId){
        task {
            taskId
            listId
            title
            description
            dueDate
            createdAt
            assignedUsers {
              userId
              name
            }
          }
    }
  }
`;

