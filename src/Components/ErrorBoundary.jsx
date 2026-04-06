import React from "react";
import ErrorPage from "../Components/ErrorPage";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ERROR GLOBAL:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage code="500" msg="Error inesperado" />;
    }

    return this.props.children;
  }
}