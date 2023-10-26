import { Route } from "react-router-dom";
import CheckRoute from "../../../Component/routers/utils";

const RouteHandler = ({ routes, authProps, userRole }) => {
    const defaultProtectedRouteProps = {
      ...authProps,
    };
    return (
      routes?.map((route, index) => {
        if (route.roleType === userRole) {
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <CheckRoute
                  {...defaultProtectedRouteProps}
                  outlet={<route.component />}
                />
              }
            />
          );
        } else {
          return null;
        }
      })
    );
  };
export default RouteHandler;
  