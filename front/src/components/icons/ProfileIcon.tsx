import React from 'react';

const styles = {
  Icon: {
    color: '#ffffff',
    fill: '#ffffff',
    fontSize: '24px',
    top: '25px',
    left: '14px',
    width: '24px',
    height: '24px',
  },
};

const ProfileIconComponent = () => (
  <svg style={styles.Icon} viewBox="0 0 24 24">
    <path fill="none" d="M0 0h24v24H0z"></path>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88a9.947 9.947 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20z"></path>
  </svg>
);

const defaultProps = {
  ProfileIconComponent,
};

const ProfileIcon = (props: {
  ProfileIconComponent?: React.ComponentType<{ style: React.CSSProperties }>;
}) => {
  return props.ProfileIconComponent ? (
    <props.ProfileIconComponent style={styles.Icon} />
  ) : (
    <defaultProps.ProfileIconComponent />
  );
};

export default ProfileIcon;