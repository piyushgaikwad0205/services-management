"use client";
import { createContext, useContext, useReducer, useCallback, useEffect, useRef } from "react";
import { BOOKING_STATUS, ROLES } from "@/lib/data";

// ─── API helper ───────────────────────────────────────────────────────────────
async function api(path, options = {}) {
  try {
    const res = await fetch(path, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    return await res.json();
  } catch (err) {
    console.error(`API [${options.method || "GET"} ${path}]:`, err);
    return null;
  }
}

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState = {
  currentUser: null,
  users: [],
  categories: [],
  bookings: [],
  reviews: [],
  loginError: null,
  registerError: null,
  dbLoading: true,
};

// ─── Action Types ─────────────────────────────────────────────────────────────
const ACTIONS = {
  LOAD_DATA: "LOAD_DATA",
  SET_CURRENT_USER: "SET_CURRENT_USER",
  SET_LOGIN_ERROR: "SET_LOGIN_ERROR",
  SET_REGISTER_ERROR: "SET_REGISTER_ERROR",
  LOGOUT: "LOGOUT",
  CREATE_BOOKING: "CREATE_BOOKING",
  UPDATE_BOOKING_STATUS: "UPDATE_BOOKING_STATUS",
  UPDATE_BOOKING: "UPDATE_BOOKING",
  CANCEL_BOOKING: "CANCEL_BOOKING",
  ADD_REVIEW: "ADD_REVIEW",
  APPROVE_REVIEW: "APPROVE_REVIEW",
  REJECT_REVIEW: "REJECT_REVIEW",
  UPDATE_PROVIDER_PROFILE: "UPDATE_PROVIDER_PROFILE",
  TOGGLE_AVAILABILITY: "TOGGLE_AVAILABILITY",
  APPROVE_PROVIDER: "APPROVE_PROVIDER",
  REJECT_PROVIDER: "REJECT_PROVIDER",
  ADD_CATEGORY: "ADD_CATEGORY",
  UPDATE_CATEGORY: "UPDATE_CATEGORY",
  DELETE_CATEGORY: "DELETE_CATEGORY",
  UPDATE_WORK_NOTES: "UPDATE_WORK_NOTES",
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    // ── MongoDB data loaded on mount ──────────────────────────────────────────
    case ACTIONS.LOAD_DATA:
      return {
        ...state,
        users: action.users ?? state.users,
        categories: action.categories ?? state.categories,
        bookings: action.bookings ?? state.bookings,
        reviews: action.reviews ?? state.reviews,
        dbLoading: false,
      };

    // ── Auth (handled by API, not local lookup) ───────────────────────────────
    case ACTIONS.SET_CURRENT_USER:
      return { ...state, currentUser: action.user, loginError: null, registerError: null };

    case ACTIONS.SET_LOGIN_ERROR:
      return { ...state, loginError: action.error };

    case ACTIONS.SET_REGISTER_ERROR:
      return { ...state, registerError: action.error };

    case ACTIONS.LOGOUT:
      return { ...state, currentUser: null };

    case ACTIONS.CREATE_BOOKING: {
      const newBooking = {
        id: `b${Date.now()}`,
        ...action.payload,
        status: BOOKING_STATUS.REQUESTED,
        workNotes: "",
        beforeImages: [],
        afterImages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { ...state, bookings: [...state.bookings, newBooking] };
    }

    case ACTIONS.UPDATE_BOOKING_STATUS: {
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.id === action.bookingId
            ? { ...b, status: action.status, updatedAt: new Date().toISOString() }
            : b
        ),
      };
    }

    case ACTIONS.UPDATE_BOOKING: {
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.id === action.bookingId
            ? { ...b, ...action.payload, updatedAt: new Date().toISOString() }
            : b
        ),
      };
    }

    case ACTIONS.UPDATE_WORK_NOTES: {
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.id === action.bookingId
            ? {
                ...b,
                workNotes: action.notes,
                beforeImages: action.beforeImages ?? b.beforeImages,
                afterImages: action.afterImages ?? b.afterImages,
                updatedAt: new Date().toISOString(),
              }
            : b
        ),
      };
    }

    case ACTIONS.ADD_REVIEW: {
      const review = {
        id: `r${Date.now()}`,
        ...action.payload,
        isApproved: true,
        createdAt: new Date().toISOString(),
      };
      // Update provider rating
      const providerReviews = [...state.reviews, review].filter(
        (r) => r.providerId === action.payload.providerId && r.isApproved
      );
      const avgRating =
        providerReviews.reduce((sum, r) => sum + r.rating, 0) / providerReviews.length;
      const updatedUsers = state.users.map((u) =>
        u.id === action.payload.providerId
          ? {
              ...u,
              profile: {
                ...u.profile,
                rating: Math.round(avgRating * 10) / 10,
                reviewCount: providerReviews.length,
              },
            }
          : u
      );
      return {
        ...state,
        reviews: [...state.reviews, review],
        users: updatedUsers,
      };
    }

    case ACTIONS.APPROVE_REVIEW:
      return {
        ...state,
        reviews: state.reviews.map((r) =>
          r.id === action.reviewId ? { ...r, isApproved: true } : r
        ),
      };

    case ACTIONS.REJECT_REVIEW:
      return {
        ...state,
        reviews: state.reviews.filter((r) => r.id !== action.reviewId),
      };

    case ACTIONS.UPDATE_PROVIDER_PROFILE: {
      const updatedUsers = state.users.map((u) =>
        u.id === action.userId
          ? { ...u, ...action.userPayload, profile: { ...u.profile, ...action.profilePayload } }
          : u
      );
      return {
        ...state,
        users: updatedUsers,
        currentUser:
          state.currentUser?.id === action.userId
            ? updatedUsers.find((u) => u.id === action.userId)
            : state.currentUser,
      };
    }

    case ACTIONS.TOGGLE_AVAILABILITY: {
      const updatedUsers = state.users.map((u) =>
        u.id === action.userId
          ? { ...u, profile: { ...u.profile, isAvailable: !u.profile.isAvailable } }
          : u
      );
      return {
        ...state,
        users: updatedUsers,
        currentUser:
          state.currentUser?.id === action.userId
            ? updatedUsers.find((u) => u.id === action.userId)
            : state.currentUser,
      };
    }

    case ACTIONS.APPROVE_PROVIDER: {
      const updatedUsers = state.users.map((u) =>
        u.id === action.userId
          ? { ...u, profile: { ...u.profile, isApproved: true } }
          : u
      );
      return { ...state, users: updatedUsers };
    }

    case ACTIONS.REJECT_PROVIDER: {
      return { ...state, users: state.users.filter((u) => u.id !== action.userId) };
    }

    case ACTIONS.ADD_CATEGORY:
      return {
        ...state,
        categories: [...state.categories, { id: `cat${Date.now()}`, ...action.payload }],
      };

    case ACTIONS.UPDATE_CATEGORY:
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.categoryId ? { ...c, ...action.payload } : c
        ),
      };

    case ACTIONS.DELETE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter((c) => c.id !== action.categoryId),
      };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // stateRef lets stable useCallback closures read the latest state
  const stateRef = useRef(state);
  stateRef.current = state;

  // ── Load all data from MongoDB on first render ─────────────────────────────
  useEffect(() => {
    async function loadData() {
      const [users, categories, bookings, reviews] = await Promise.all([
        api("/api/users"),
        api("/api/categories"),
        api("/api/bookings"),
        api("/api/reviews"),
      ]);
      dispatch({
        type: ACTIONS.LOAD_DATA,
        users: users ?? [],
        categories: categories ?? [],
        bookings: bookings ?? [],
        reviews: reviews ?? [],
      });
    }
    loadData();
  }, []);

  // ── Auth (fully async — waits for MongoDB response) ───────────────────────
  const login = useCallback(async (email, password) => {
    dispatch({ type: ACTIONS.SET_LOGIN_ERROR, error: null });
    const data = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (data?.user) {
      dispatch({ type: ACTIONS.SET_CURRENT_USER, user: data.user });
    } else {
      dispatch({
        type: ACTIONS.SET_LOGIN_ERROR,
        error: data?.error || "Invalid email or password",
      });
    }
  }, []);

  const logout = useCallback(() => dispatch({ type: ACTIONS.LOGOUT }), []);

  const register = useCallback(async (payload) => {
    dispatch({ type: ACTIONS.SET_REGISTER_ERROR, error: null });
    const data = await api("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (data?.user) {
      dispatch({ type: ACTIONS.SET_CURRENT_USER, user: data.user });
    } else {
      dispatch({
        type: ACTIONS.SET_REGISTER_ERROR,
        error: data?.error || "Registration failed",
      });
    }
  }, []);

  // ── Bookings (optimistic local update + background persist) ───────────────
  const createBooking = useCallback((payload) => {
    const id = `b${Date.now()}`;
    dispatch({ type: ACTIONS.CREATE_BOOKING, payload: { ...payload, id } });
    api("/api/bookings", {
      method: "POST",
      body: JSON.stringify({ _id: id, ...payload, status: BOOKING_STATUS.REQUESTED }),
    });
  }, []);

  const updateBookingStatus = useCallback((bookingId, status) => {
    dispatch({ type: ACTIONS.UPDATE_BOOKING_STATUS, bookingId, status });
    api(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }, []);

  const updateBooking = useCallback((bookingId, payload) => {
    dispatch({ type: ACTIONS.UPDATE_BOOKING, bookingId, payload });
    api(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }, []);

  const updateWorkNotes = useCallback((bookingId, notes, beforeImages, afterImages) => {
    dispatch({ type: ACTIONS.UPDATE_WORK_NOTES, bookingId, notes, beforeImages, afterImages });
    api(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      body: JSON.stringify({ workNotes: notes, beforeImages, afterImages }),
    });
  }, []);

  // ── Reviews ────────────────────────────────────────────────────────────────
  const addReview = useCallback((payload) => {
    const id = `r${Date.now()}`;
    dispatch({ type: ACTIONS.ADD_REVIEW, payload: { ...payload, id } });
    api("/api/reviews", {
      method: "POST",
      body: JSON.stringify({ _id: id, ...payload }),
    });
  }, []);

  const approveReview = useCallback((reviewId) => {
    dispatch({ type: ACTIONS.APPROVE_REVIEW, reviewId });
    api(`/api/reviews/${reviewId}`, {
      method: "PATCH",
      body: JSON.stringify({ isApproved: true }),
    });
  }, []);

  const rejectReview = useCallback((reviewId) => {
    dispatch({ type: ACTIONS.REJECT_REVIEW, reviewId });
    api(`/api/reviews/${reviewId}`, { method: "DELETE" });
  }, []);

  // ── Provider ───────────────────────────────────────────────────────────────
  const updateProviderProfile = useCallback((userId, userPayload, profilePayload) => {
    dispatch({ type: ACTIONS.UPDATE_PROVIDER_PROFILE, userId, userPayload, profilePayload });
    api(`/api/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ ...userPayload, profile: profilePayload }),
    });
  }, []);

  const toggleAvailability = useCallback((userId) => {
    dispatch({ type: ACTIONS.TOGGLE_AVAILABILITY, userId });
    // Read current availability from stateRef (always fresh)
    const user = stateRef.current.users.find((u) => u.id === userId);
    if (user) {
      api(`/api/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ profile: { isAvailable: !user.profile.isAvailable } }),
      });
    }
  }, []);

  // ── Admin ──────────────────────────────────────────────────────────────────
  const approveProvider = useCallback((userId) => {
    dispatch({ type: ACTIONS.APPROVE_PROVIDER, userId });
    api(`/api/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ profile: { isApproved: true } }),
    });
  }, []);

  const rejectProvider = useCallback((userId) => {
    dispatch({ type: ACTIONS.REJECT_PROVIDER, userId });
    api(`/api/users/${userId}`, { method: "DELETE" });
  }, []);

  const addCategory = useCallback((payload) => {
    const id = `cat${Date.now()}`;
    dispatch({ type: ACTIONS.ADD_CATEGORY, payload: { ...payload, id } });
    api("/api/categories", {
      method: "POST",
      body: JSON.stringify({ _id: id, ...payload }),
    });
  }, []);

  const updateCategory = useCallback((categoryId, payload) => {
    dispatch({ type: ACTIONS.UPDATE_CATEGORY, categoryId, payload });
    api(`/api/categories/${categoryId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }, []);

  const deleteCategory = useCallback((categoryId) => {
    dispatch({ type: ACTIONS.DELETE_CATEGORY, categoryId });
    api(`/api/categories/${categoryId}`, { method: "DELETE" });
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        login, logout, register,
        createBooking, updateBookingStatus, updateBooking, updateWorkNotes,
        addReview, approveReview, rejectReview,
        updateProviderProfile, toggleAvailability,
        approveProvider, rejectProvider,
        addCategory, updateCategory, deleteCategory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
