import React from "react";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";

import { useAuth } from "./auth/AuthContext";
import { useLanguage } from "./lang/LanguageContext";

interface IMenuConfigLink {
  needAuth?: boolean;
  text: string;
  to: string;
}

interface IMenuConfigDropDown {
  links: Array<IMenuConfigLink | "separator">;
  needAuth?: boolean;
  text: string;
}

const isLink = (
  item: IMenuConfigDropDown | IMenuConfigLink | "separator"
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
      <NavDropdown id={firstItem.to} key={firstItem.to} title={item.text}>
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

const Menu = (): JSX.Element => {
  const lang = useLanguage();
  const { isAuth, username } = useAuth();

  const leftMenu: Array<IMenuConfigLink | IMenuConfigDropDown> = [
    {
      links: [
        {
          text: lang.ui.title.championsList,
          to: "/champions",
        },
        {
          text: lang.ui.title.teams,
          to: "/teams",
        },
      ],
      text: lang.ui.title.champions,
    },
    {
      links: [
        {
          text: lang.ui.title.artifacts,
          to: "/artifacts",
        },
        {
          text: lang.ui.title.accessories,
          to: "/artifacts/accessories",
        },
        {
          text: lang.ui.title.sellList,
          to: "/artifacts/sell-list",
        },
      ],
      text: lang.ui.title.artifacts,
    },
    {
      links: [
        {
          text: lang.ui.title.champions,
          to: "/champions/configurations",
        },
        { text: lang.ui.title.results, to: "/results" },
      ],
      text: lang.ui.title.optimizer,
    },
  ];
  const rightMenu: Array<IMenuConfigLink | IMenuConfigDropDown> = [
    {
      links: [
        {
          text: lang.ui.title.config,
          to: "/config",
        },
        {
          text: lang.ui.title.importExport,
          to: "/config/import",
        },
        "separator",
        {
          text: lang.ui.title.gameProgression,
          to: "/config/game",
        },
        {
          needAuth: true,
          text: lang.ui.title.profileOptions,
          to: "/config/profile",
        },
        "separator",
        {
          needAuth: false,
          text: lang.ui.title.signup,
          to: "/auth/sign-up",
        },
        {
          needAuth: false,
          text: lang.ui.title.login,
          to: "/auth/sign-in",
        },
        {
          needAuth: true,
          text: lang.ui.title.logout,
          to: "/auth/sign-out",
        },
      ],
      text: username ?? lang.ui.title.profile,
    },
  ];

  return (
    <Navbar bg="primary" expand="lg" fixed="top" variant="dark">
      <Container>
        <Link className="navbar-brand" to="/">
          <img
            alt=""
            className="d-inline-block align-top"
            height="30"
            src="./android-chrome-192x192.png"
            width="30"
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

export default Menu;
