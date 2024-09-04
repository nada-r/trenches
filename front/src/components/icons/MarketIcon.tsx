import React from 'react';

const styles = {
  Icon: {
    top: '758px',
    left: '232px',
    width: '17px',
    height: '18px',
    backgroundImage: 'url(./image.png)',
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  },
};

const MarketIconComponent: React.FC<{ style?: React.CSSProperties }> & { image: string } = ({ style }) => (
    <div style={{ ...styles.Icon, ...style, backgroundImage: `url(${MarketIconComponent.image})` }} />
  );
  
  MarketIconComponent.image = 'https://assets.api.uizard.io/api/cdn/stream/26972334-a1d0-4140-88d0-11d61fa05574.png';
  
  const defaultProps = {
    MarketIconComponent,
  };
  
  const MarketIcon = (props: { MarketIconComponent?: React.ComponentType<{ style?: React.CSSProperties }> }) => {
    const IconComponent = props.MarketIconComponent || defaultProps.MarketIconComponent;
    return <IconComponent style={styles.Icon} />;
  };

export default MarketIcon;