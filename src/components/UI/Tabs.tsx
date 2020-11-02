/* eslint-disable jsx-a11y/anchor-is-valid */
import classNames from "classnames";
import { Language } from "lang/language";
import { useLanguage } from "lang/LanguageContext";

import React, { useState } from "react";
import styled from "styled-components";

export interface TabProps {
  id: string;
  title: string;
  page: JSX.Element;
  disable?: boolean;
}

export interface TabsProps {
  tabs: TabProps[];
  defaultTabs?: string;
  widget?: JSX.Element;
  main?: boolean;
}

const Tab = styled.li.attrs((p: { active: boolean }) => ({
  className: classNames("nav-item", {
    active: p.active,
  }),
}))<{ active: boolean }>`
  cursor: pointer;
`;

export default (props: TabsProps): JSX.Element => {
  const { tabs, defaultTabs, widget, main } = props;

  const [activeTabs, setTabs] = useState(defaultTabs ?? tabs[0].id ?? "");
  const lang = useLanguage();
  return (
    <>
      <nav
        className={classNames("navbar navbar-expand-lg", {
          "navbar-dark bg-dark fixed-top": main,
        })}
      >
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav">
            {tabs.map((tab) => (
              <Tab active={tab.id === activeTabs} key={tab.id}>
                <a
                  role="button"
                  className={classNames("nav-link", {
                    disabled: tab.disable,
                  })}
                  href="#"
                  onClick={() => {
                    setTabs(tab.id);
                  }}
                >
                  {lang[tab.title as keyof Language]}
                </a>
              </Tab>
            ))}
          </ul>
        </div>
        <form className="form-inline my-2 my-lg-0">{widget}</form>
      </nav>
      {tabs.find((t) => t.id === activeTabs)?.page}
    </>
  );
};
