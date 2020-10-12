import { gql } from "apollo-boost";

export const CREATE_EVENT = gql`
  mutation addEvent(
    $name: String!
    $eventCreator: ID!
    $description: String!
    $position: String!
    $startAt: Date!
    $endAt: Date!
  ) {
    addEvent(
      input: {
        name: $name
        eventCreator: $eventCreator
        description: $description
        position: $position
        startAt: $startAt
        endAt: $endAt
      }
    ) {
      errors {
        field
        messages
      }
      event {
        id
        name
        slug
        position
      }
    }
  }
`;

export const ALL_EVENTS = gql`
  query {
    allEvents {
      id
      name
      eventCreator {
        owner {
          email
        }
        community {
          name
        }
      }
      slug
      description
      position
      startAt
      endAt
    }
  }
`;

export const GET_COMMUNITY_EVENTS_BY_SLUG = gql`
  query getCommunityEventsBySlug($slug: String!) {
    getCommunityEventsBySlug(slug: $slug) {
      id
      name
      slug
      description
      position
      startAt
      endAt
    }
  }
`;

export const GET_CURRENT_EVENT = gql`
  query getCurrentEvent($id: ID!) {
    getCurrentEvent(id: $id) {
      id
      name
      slug
      eventCreator {
        owner {
          firstName
          lastName
        }
        community {
          name
          slug
        }
      }
      description
      position
      startAt
      endAt
    }
  }
`;

export const CREATE_EVENT_JOIN_REQUEST = gql`
  mutation createEventJoinRequest($eventId: ID!) {
    createEventJoinRequest(eventId: $eventId) {
      success
      eventJoinReq {
        id
      }
    }
  }
`;

export const ACCEPT_EVENT_JOIN_REQUEST = gql`
  mutation acceptEventJoinRequest($id: ID!) {
    acceptEventJoinRequest(id: $id) {
      success
      eventJoinReq {
        id
      }
    }
  }
`;
