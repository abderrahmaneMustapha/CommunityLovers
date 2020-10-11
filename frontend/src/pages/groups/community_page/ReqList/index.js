import React from "react";
import { useMutation, useQuery } from "react-apollo";
import {
  GET_CUMMUNITY_JOIN_REQUEST,
  GET_COMMUNITY_MEMBERS,
  ACCEPT_COMMUNITY_JOIN_REQUEST,
} from "../../../../api/communitys/index";
import { Heading, List, Box, Button, Text} from "grommet";
import {useHistory } from "react-router-dom";

export function JoinCommunityRequestList(props) {
  const { data, loading} = useQuery(GET_CUMMUNITY_JOIN_REQUEST, {
    variables: { slug: props.slug },
  });

  const [acceptRequest] = useMutation(
    ACCEPT_COMMUNITY_JOIN_REQUEST
  );

  if (loading && !data) return <div>Loading ... </div>;
  return (
    <>
      {data ? (
        <List data={data.getCommunityJoinRequests}>
          {(element) => (
            <Box key={element.id} fill>
              <Heading level="4">
                {element.member.firstName} {element.member.lastName}
              </Heading>
              <Button
                primary
                color="dark-1"
                label="accept this user"
                onClick={(event) => {
                  acceptRequest({
                    variables: { id: Number(element.id) },
                  });
                }}
                type="button"
              ></Button>
            </Box>
          )}
        </List>
      ) : (
        <div>Nothing here to see ...</div>
      )}
    </>
  );
}

export function CommunityMemebersList(props) {
  const { data, loading } = useQuery(GET_COMMUNITY_MEMBERS, {
    variables: { slug: props.slug },
  });

  const history = useHistory()

  if (loading && !data) return <div>Loading ... </div>;
  return (
    <>
      {data ? (
        <List
          primaryKey={item=>(
            <Text>{item.member.email}</Text>
          )}
          secondaryKey=""
          onClickItem={event=>{
            history.push(`/profiles/${event.item.username}`)
          }}
          data={data.getCommunityMembers}
        />
      ) : (
        <div>Nothing here to see ...</div>
      )}
    </>
  );
}
