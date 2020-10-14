import React from "react";

import { useQuery } from "react-apollo";
import { Drop } from "../../../components/lists/drop/index";
import { CurrentEvents, PastEvents, UpcomingEvents } from "./EventsList/index";
import { GET_CURRENT_USER_COMMUNITYS } from "../../../api/communitys/index";

import {
  Heading,
  Tabs,
  Tab,
  Anchor,
  Header,
  Nav,
  Main,
  Box,
  DropButton,
} from "grommet";

const items = [
  { label: "Create new Community", href: "/create-community" },
  { label: "Logout ", href: "/logout" },
];

function Dashboard() {
  const { data: currentuser_data, loading: currentuser_loading } = useQuery(
    GET_CURRENT_USER_COMMUNITYS
  );

  const [open, setOpen] = React.useState();

  const onOpen = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  if (currentuser_loading) return <div>Loading</div>;

  return (
    <>
      <Header background="dark-1" pad="small">
        <Nav direction="row">
          {items.map((item) => (
            <Anchor href={item.href} label={item.label} key={item.label} />
          ))}
          {currentuser_data ? (
            <DropButton
              label="Options"
              open={open}
              onOpen={onOpen}
              onClose={onClose}
              dropContent={
                <Drop
                  data={currentuser_data.getCurrentUserCommunitys}
                  header={"Communitys"}
                />
              }
              dropProps={{ align: { top: "bottom" } }}
            />
          ) : undefined}
        </Nav>
      </Header>
      <Main>
        <Box pad="small">
          <Heading level="3">
            Here is what happening in Community Lovers
          </Heading>
        </Box>

        <Box gap="medium" pad="large">
          <Tabs>
            <Tab title="Past events">
              <PastEvents />
            </Tab>
            <Tab title="Current events">
              <CurrentEvents />
            </Tab>
            <Tab title="Up comming events">
              <UpcomingEvents />
            </Tab>
          </Tabs>
        </Box>
      </Main>
    </>
  );
}

export default Dashboard;
