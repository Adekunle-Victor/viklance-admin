import { configureStore } from "@reduxjs/toolkit";
import authReducer          from "./slices/auth.slice";
import leadsReducer         from "./slices/leads.slice";
import referralsReducer     from "./slices/referrals.slice";
import projectsReducer      from "./slices/projects.slice";
import payoutsReducer       from "./slices/payouts.slice";
import prospectsReducer     from "./slices/prospects.slice";
import notificationsReducer from "./slices/notifications.slice";
import outreachReducer      from "./slices/outreach.slice";

export const store = configureStore({
  reducer: {
    auth:          authReducer,
    leads:         leadsReducer,
    referrals:     referralsReducer,
    projects:      projectsReducer,
    payouts:       payoutsReducer,
    prospects:     prospectsReducer,
    notifications: notificationsReducer,
    outreach:      outreachReducer,
  },
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
