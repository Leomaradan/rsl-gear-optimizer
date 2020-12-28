import { useLanguage } from "lang/LanguageContext";
import { useAuth } from "auth/AuthContext";

import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";

interface IMenuConfigLink {
  to: string;
  text: string;
  needAuth?: boolean;
}

interface IMenuConfigDropDown {
  text: string;
  links: Array<IMenuConfigLink | "separator">;
  needAuth?: boolean;
}

const isLink = (
  item: IMenuConfigLink | IMenuConfigDropDown | "separator"
): item is IMenuConfigLink => {
  return (item as IMenuConfigLink).to !== undefined;
};

const getMenu = (
  menu: Array<IMenuConfigLink | IMenuConfigDropDown>,
  isAuth: boolean
): (JSX.Element | null)[] =>
  menu.map((item) => {
    if (item.needAuth === false && isAuth) {
      return null;
    }

    if (item.needAuth === true && !isAuth) {
      return null;
    }

    if (isLink(item)) {
      return (
        <LinkContainer key={item.to} to={item.to}>
          <Nav.Link>{item.text}</Nav.Link>
        </LinkContainer>
      );
    }

    const firstItem = item.links[0] as IMenuConfigLink;
    return (
      <NavDropdown key={firstItem.to} title={item.text} id={firstItem.to}>
        {item.links.map((subitem, index) => {
          if (subitem === "separator") {
            // eslint-disable-next-line react/no-array-index-key
            return <NavDropdown.Divider key={index} />;
          }

          if (subitem.needAuth === false && isAuth) {
            return null;
          }

          if (subitem.needAuth === true && !isAuth) {
            return null;
          }

          return (
            <LinkContainer key={`sub-${subitem.to}`} to={subitem.to}>
              <NavDropdown.Item>{subitem.text}</NavDropdown.Item>
            </LinkContainer>
          );
        })}
      </NavDropdown>
    );
  });

export default (): JSX.Element => {
  const lang = useLanguage();
  const { isAuth, username } = useAuth();

  const leftMenu: Array<IMenuConfigLink | IMenuConfigDropDown> = [
    {
      text: lang.ui.title.champions,
      links: [
        {
          to: "/champions",
          text: lang.ui.title.championsList,
        },
        {
          to: "/teams",
          text: lang.ui.title.teams,
        },
      ],
    },
    {
      text: lang.ui.title.artifacts,
      links: [
        {
          to: "/artifacts",
          text: lang.ui.title.artifacts,
        },
        {
          to: "/artifacts/accessories",
          text: lang.ui.title.accessories,
        },
        {
          to: "/artifacts/sell-list",
          text: lang.ui.title.sellList,
        },
      ],
    },
    {
      text: lang.ui.title.optimizer,
      links: [
        {
          to: "/champions/configurations",
          text: lang.ui.title.champions,
        },
        { to: "/results", text: lang.ui.title.results },
      ],
    },
  ];
  const rightMenu: Array<IMenuConfigLink | IMenuConfigDropDown> = [
    {
      text: username ?? lang.ui.title.profile,
      links: [
        {
          to: "/config",
          text: lang.ui.title.config,
        },
        {
          to: "/config/import",
          text: lang.ui.title.importExport,
        },
        "separator",
        {
          to: "/config/game",
          text: lang.ui.title.gameProgression,
        },
        {
          to: "/config/profile",
          text: lang.ui.title.profileOptions,
          needAuth: true,
        },
        "separator",
        {
          to: "/auth/sign-up",
          text: lang.ui.title.signup,
          needAuth: false,
        },
        {
          to: "/auth/sign-in",
          text: lang.ui.title.login,
          needAuth: false,
        },
        {
          to: "/auth/sign-out",
          text: lang.ui.title.logout,
          needAuth: true,
        },
      ],
    },
  ];

  return (
    <Navbar bg="primary" expand="lg" variant="dark" fixed="top">
      <Container>
        <Link to="/" className="navbar-brand">
          <img
            alt=""
            src="./android-chrome-192x192.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">{getMenu(leftMenu, isAuth)}</Nav>
          <Nav className="ml-auto">{getMenu(rightMenu, isAuth)}</Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
