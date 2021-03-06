import { gql } from "apollo-boost";

export const CREATE_COMMUNITY = gql`
  mutation addCommunity($name: String!) {
    addCommunity(input: { name: $name }) {
      errors {
        field
        messages
      }
      community {
        id
        slug
        name
      }
    }
  }
`;

export const CREATE_COMMUNITY_OWNER = gql`
  mutation addOwnerToCommunity($owner: ID!, $community: ID!) {
    addOwnerToCommunity(input: { owner: $owner, community: $community }) {
      communityOwner {
        id
      }
      errors {
        field
        messages
      }
    }
  }
`;

export const GET_CURRENT_COMMUNITY_BY_SLUG = gql`
  query getCommunitysBySlug($slug: String!) {
    getCommunitysBySlug(slug: $slug) {
      id
      owner {
        id
        email
        dateJoined
        username
        firstName
        lastName
      }
      community {
        id
        name
        slug
        createdAt
      }
    }
  }
`;

export const GET_CURRENT_COMMUNITY_OWNER = gql`
  query {
    getCurrentCommunityOwner {
      id
    }
  }
`;

export const GET_CURRENT_USER_COMMUNITYS = gql`
  query {
    getCurrentUserCommunitys {
      community {
        name
        slug
      }
      owner {
        email
      }
    }
  }
`;

export const ADD_COMMUNITY_JOIN_REQUEST = gql`
  mutation addCommunityJoinRequest($community: ID!) {
    addCommunityJoinRequest(community: $community) {
      success
      communityJoinReq {
        member {
          id
        }
        community {
          id
        }
      }
    }
  }
`;

export const GET_CUMMUNITY_JOIN_REQUEST = gql`
  query getCommunityJoinRequests($slug: String!) {
    getCommunityJoinRequests(slug: $slug) {
      id
      member {
        id
        email
        firstName
        lastName
      }
    }
  }
`;

export const GET_COMMUNITY_MEMBERS = gql`
  query getCommunityMembers($slug: String!) {
    getCommunityMembers(slug: $slug) {
      member {
        id
        email
        firstName
        lastName
        city
        profilePic
        country
      }
    }
  }
`;

export const ACCEPT_COMMUNITY_JOIN_REQUEST = gql`
  mutation acceptCommunityJoinRequest($id: ID!) {
    acceptCommunityJoinRequest(id: $id) {
      success
      communityJoinReq {
        id
        member {
          id
        }
      }
    }
  }
`;
