import React from 'react';

const styles = {
  Icon: {
    color: '#cd7f32',
    fill: '#cd7f32',
    fontSize: '46px',
    top: '159px',
    left: '26px',
    width: '46px',
    height: '86px',
  },
};

const SimCardIconComponent = () => (
  <svg style={styles.Icon} viewBox="0 0 24 24">
    <path d="M0 0h24v24H0z" fill="none"></path>
    <path d="M19.99 4c0-1.1-.89-2-1.99-2h-8L4 8v12c0 1.1.9 2 2 2h12.01c1.1 0 1.99-.9 1.99-2l-.01-16zM9 19H7v-2h2v2zm8 0h-2v-2h2v2zm-8-4H7v-4h2v4zm4 4h-2v-4h2v4zm0-6h-2v-2h2v2zm4 2h-2v-4h2v4z"></path>
  </svg>
);

const defaultProps = {
  SimCardIconComponent,
};

const SimCardIcon = (props: {
  IconComponent?: React.ComponentType<{ style: React.CSSProperties }>;
}) => {
  return props.IconComponent ? (
    <props.IconComponent style={styles.Icon} />
  ) : (
    <defaultProps.SimCardIconComponent />
  );
};

export default SimCardIcon;