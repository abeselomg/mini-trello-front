import { gql } from "@apollo/client";

export const GET_LISTS = gql`
  query Lists {
    lists {
      listId
      boardId
      name
      tasks {
        taskId
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

export const GET_USERS = gql`
  query Users {
    users {
      userId
      name
    }
  }
`;


export const GET_BOARDS = gql`
  query Boards {
    boards {
      boardId
      name
    }
  }
`;
