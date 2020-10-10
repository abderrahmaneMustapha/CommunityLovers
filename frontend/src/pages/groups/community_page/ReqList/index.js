import React from "react";
import { useMutation, useQuery } from "react-apollo";
import {
  GET_CUMMUNITY_JOIN_REQUEST,
  GET_COMMUNITY_MEMBERS,
  ACCEPT_COMMUNITY_JOIN_REQUEST,
} from "../../../../api/communitys/index";
import { Heading, List, Box, Button } from "grommet";

export function JoinCommunityRequestList(props) {
 
  const { data, loading, error } = useQuery(GET_CUMMUNITY_JOIN_REQUEST, {
    variables: { slug: props.slug },
  });
  
  const [acceptRequest, {data:accept_data}] = useMutation(ACCEPT_COMMUNITY_JOIN_REQUEST)

  

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
                onClick={event=>{
                  acceptRequest({
                    variables : {id : Number(element.id)}
                  })
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
  const { data, loading, error } = useQuery(GET_COMMUNITY_MEMBERS, {
    variables: { slug: props.slug },
  });

  if (loading && !data) return <div>Loading ... </div>;
  return (
    <>
      {data ? (
        data.getCommunityMembers.map((element) => (
          <div>{element.member.email}</div>
        ))
      ) : (
        <div>Nothing here to see ...</div>
      )}
    </>
  );
}
