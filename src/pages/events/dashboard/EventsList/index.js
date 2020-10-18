import React from "react"
import { useHistory } from "react-router-dom";
import { useQuery } from "react-apollo";
import { ALL_CURRENT_EVENTS,ALL_PAST_EVENTS,ALL_UPCOMMING_EVENTS } from "../../../../api/events/index";
import {
    Text,
    List,
    Box,
    Heading
  } from "grommet";

export function PastEvents(){
    const { loading, data } = useQuery(ALL_PAST_EVENTS);
    
    let history = useHistory();
    if (loading) return <div>Loading ... </div>
    return(
        <>
        {data ? (
            <List data={data.getAllPastEvents}>
              {(element) => (
                <Box
                  key={element.id}
                  onClick={(event) => history.push(`/event/${element.id}`)}
                  fill
                >
                  <Heading level="4">{element.name}</Heading>
                  <Text size="small">
                    {" "}
                    by {element.eventCreator.community.name}
                  </Text>
                  <Text size="small"> on {element.startAt}</Text>
                  <Text size="small"> place {element.position}</Text>

                
                </Box>
              )}
            </List>
          ) : (
            <div>Loading...</div>
          )}
          </>
    )
}



export function CurrentEvents(){
    const { loading, data } = useQuery( ALL_CURRENT_EVENTS);
    
    let history = useHistory();
    if (loading) return <div>Loading ... </div>
    return(
        <>
        {data ? (
            <List data={data.getAllCurrentEvents}>
              {(element) => (
                <Box
                  key={element.id}
                  onClick={(event) => history.push(`/event/${element.id}`)}
                  fill
                >
                  <Heading level="4">{element.name}</Heading>
                  <Text size="small">
                    {" "}
                    by {element.eventCreator.community.name}
                  </Text>
                  <Text size="small"> on {element.startAt}</Text>
                  <Text size="small"> place {element.position}</Text>

                
                </Box>
              )}
            </List>
          ) : (
            <div>Loading...</div>
          )}
          </>
    )
}



export function UpcomingEvents(){
    const { loading,  data } = useQuery(ALL_UPCOMMING_EVENTS);
    console.log(data)
    let history = useHistory();
    if (loading) return <div>Loading ... </div>
    return(
        <>
        {data ? (
            <List data={data.getAllUpcomingEvents}>
              {(element) => (
                <Box
                  key={element.id}
                  onClick={(event) => history.push(`/event/${element.id}`)}
                  fill
                >
                  <Heading level="4">{element.name}</Heading>
                  <Text size="small">
                    {" "}
                    by {element.eventCreator.community.name}
                  </Text>
                  <Text size="small"> on {element.startAt}</Text>
                  <Text size="small"> place {element.position}</Text>

                
                </Box>
              )}
            </List>
          ) : (
            <div>Loading...</div>
          )}
          </>
    )
}