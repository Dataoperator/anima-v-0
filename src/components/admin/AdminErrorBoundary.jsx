import React from 'react';

class AdminErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 w-full max-w-2xl">
            <div className="flex">
              <div className="flex-1">
                <h3 className="text-red-800 font-medium">Error in Admin Dashboard</h3>
                <div className="text-red-700 mt-2">
                  <p>Something went wrong in the admin interface.</p>
                  <p className="mt-2 text-sm text-red-600">{this.state.error?.message}</p>
                </div>
                <button
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AdminErrorBoundary;