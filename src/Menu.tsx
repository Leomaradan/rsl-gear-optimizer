import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { useSelector } from "react-redux";
import { IndexLinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";

import { useAuth } from "./auth/AuthContext";
import { useLanguage } from "./lang/LanguageContext";
import type { IState } from "./redux/reducers";

interface IMenuConfigLink {
  text: string;
  to: string;
}

interface IMenuConfigDropDown {
  links: Array<IMenuConfigLink | "separator">;
  text: string;
}

const isLink = (
  item: IMenuConfigDropDown | IMenuConfigLink | "separator"
): item is IMenuConfigLink => {
  return (item as IMenuConfigLink).to !== undefined;
};

const getMenu = (
  menu: Array<IMenuConfigLink | IMenuConfigDropDown>
): (JSX.Element | null)[] =>
  menu.map((item) => {
    if (isLink(item)) {
      return (
        <IndexLinkContainer key={item.to} to={item.to}>
          <Nav.Link>{item.text}</Nav.Link>
        </IndexLinkContainer>
      );
    }

    const firstItem = item.links[0] as IMenuConfigLink;

    return (
      <NavDropdown id={firstItem.to} key={firstItem.to} title={item.text}>
        {item.links.map((subitem, index) => {
          if (subitem === "separator") {
            return <NavDropdown.Divider key={index} />;
          }

          return (
            <IndexLinkContainer key={`sub-${subitem.to}`} to={subitem.to}>
              <NavDropdown.Item>{subitem.text}</NavDropdown.Item>
            </IndexLinkContainer>
          );
        })}
      </NavDropdown>
    );
  });

const Menu = (): JSX.Element => {
  const lang = useLanguage();
  const { isAuth } = useAuth();
  const username = useSelector((state: IState) => state.account.username);

  const leftMenu: Array<IMenuConfigLink | IMenuConfigDropDown> = [
    /*{
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
    },*/
    {
      to: "/champions",
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
  const rightMenuAuth: Array<IMenuConfigLink | IMenuConfigDropDown> = [
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
          text: lang.ui.title.profileOptions,
          to: "/config/profile",
        },
        "separator",
        {
          text: lang.ui.title.logout,
          to: "/auth/sign-out",
        },
      ],
      text: username ?? lang.ui.title.profile,
    },
  ];

  const rightMenuAnonymous: Array<IMenuConfigLink | IMenuConfigDropDown> = [
    {
      links: [
        {
          text: lang.ui.title.signup,
          to: "/auth/sign-up",
        },
        {
          text: lang.ui.title.login,
          to: "/auth/sign-in",
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
          {isAuth && <Nav className="mr-auto">{getMenu(leftMenu)}</Nav>}
          {isAuth && <Nav className="ml-auto">{getMenu(rightMenuAuth)}</Nav>}
          {!isAuth && (
            <Nav className="ml-auto">{getMenu(rightMenuAnonymous)}</Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Menu;
