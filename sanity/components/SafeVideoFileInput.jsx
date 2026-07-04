import React from 'react';

/** Props Sanity passes that must not reach DOM nodes inside the default file input. */
const FILTERED_INPUT_PROPS = new Set([
  'disableTransition',
  'sortable',
  'items',
]);

class UploadInputErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Unknown upload UI error' };
  }

  componentDidCatch(error) {
    // Keep this log for Studio debugging without crashing the whole structure tool.
    // eslint-disable-next-line no-console
    console.error('[Sanity Studio] Video upload input crashed:', error);
  }

  handleRetry = () => {
    this.setState({ hasError: false, message: '' });
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{ border: '1px solid #d97706', borderRadius: 8, padding: 12, background: '#fff7ed' }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Upload field failed to render</div>
        <div style={{ fontSize: 13, marginBottom: 10 }}>
          The Studio stayed open. Clear any incomplete upload and retry.
          {this.state.message ? ` (${this.state.message})` : ''}
        </div>
        <button
          type="button"
          onClick={this.handleRetry}
          style={{
            border: '1px solid #92400e',
            borderRadius: 6,
            padding: '6px 10px',
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          Retry upload field
        </button>
      </div>
    );
  }
}

function filterInputProps(props) {
  const safeProps = {};
  for (const [key, value] of Object.entries(props)) {
    if (!FILTERED_INPUT_PROPS.has(key)) safeProps[key] = value;
  }
  return safeProps;
}

export default function SafeVideoFileInput(props) {
  const safeProps = filterInputProps(props);
  return (
    <UploadInputErrorBoundary>
      {props.renderDefault(safeProps)}
    </UploadInputErrorBoundary>
  );
}
