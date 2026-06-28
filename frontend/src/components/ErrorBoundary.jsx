import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2">Something went wrong</h2>
          <p className="text-stone-500 dark:text-stone-400 mb-6 text-sm">An unexpected error occurred. Please try refreshing the page.</p>
          <button onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload() }} className="px-6 py-2.5 btn-glass btn-glass-lime rounded-xl font-semibold">
            Refresh Page
          </button>
          {this.props.fallback || null}
        </div>
      )
    }
    return this.props.children
  }
}
