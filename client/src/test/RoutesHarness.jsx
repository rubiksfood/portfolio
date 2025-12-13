import React from "react";
import { Routes, Route } from "react-router-dom";

export function RoutesHarness({ routes }) {
  const renderRoutes = (routeList) =>
    routeList.map(({ path, element, children }) => (
      <Route key={path} path={path} element={element}>
        {Array.isArray(children) ? renderRoutes(children) : null}
      </Route>
    ));

  return <Routes>{renderRoutes(routes)}</Routes>;
}