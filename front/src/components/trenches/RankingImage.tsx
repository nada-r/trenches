import React from 'react';

const styles = {
 RankingImageContainer: {
    top: '235px',
    left: '64px',
    width: '28px',
    height: '28px',
    borderRadius: '50%', 
    backgroundImage: 'url(./image.png)',
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  },
};

const defaultProps = {
  rankingimage: 'https://assets.api.uizard.io/api/cdn/stream/ddcabbc0-9002-4ebc-8bfc-2a47b3f636b1.png',
}

interface RankingImageProps {
    image?: string;
  }

const RankingImage = ({ image }: RankingImageProps) => {
    return (
      <div style={{
        ...styles.RankingImageContainer,
        backgroundImage: `url(${image ?? defaultProps.rankingimage})`,
      }} />
    );
  };

export default RankingImage;