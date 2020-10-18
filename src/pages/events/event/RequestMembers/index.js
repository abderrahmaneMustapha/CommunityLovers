import React from "react";
import { List, Button, Text } from "grommet";
import { useQuery, useMutation } from "react-apollo";
import {useHistory} from "react-router-dom"
import {
  GET_EVENT_REQUEST_ACCEPTED,
  GET_EVENT_REQUEST_PENDING,
  ACCEPT_EVENT_JOIN_REQUEST,
} from "../../../../api/events/index";

export function EventJoinRequestList(props) {
  const [acceptEvent] = useMutation(ACCEPT_EVENT_JOIN_REQUEST);
  const { data, loading } = useQuery(GET_EVENT_REQUEST_PENDING, {
      variables : {id : Number(props.id)}
  });

  if (loading) return <div> Loading ... </div>;
  return (
    <List
      primaryKey={(item) => (
        <div>
          <Text>{item.member.email}</Text>
          <Button onClick={(event) => {
             acceptEvent({
                 variables : {id: item.id}
             })
          }} label="Accept"></Button>
        </div>
      )}
      data={data.getEventRequestPending}
    ></List>
  );
}


export function EventMemebersList(props) {
    const history = useHistory()
    const { data, loading } = useQuery(GET_EVENT_REQUEST_ACCEPTED, {
        variables : {id : Number(props.id)}
    });
  
    if (loading) return <div> Loading ... </div>;
    return (
      <List
        primaryKey={(item) => (
          <div>
            <Text>{item.member.email}</Text>
          </div>
        )}
        onClickItem={(event)=>{
            history.push(`/profiles/${event.item.member.id}`)
        }}
        data={data.getEventRequestAccepted}
      ></List>
    );
  }
  