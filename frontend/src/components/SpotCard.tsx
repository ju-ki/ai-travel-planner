import Image from 'next/image';
import React, { Fragment } from 'react';
import Link from 'next/link';

import { PlaceInfo } from '@/lib/plan';

const SpotCard = ({ spot }: { spot: PlaceInfo }) => {
  return (
    <div>
      {spot.photos?.length ? (
        spot.photos.map((photo, index) =>
          index == 0 ? (
            <div key={index} className="mb-2">
              <Image src={photo.flagContentURI} width={150} height={100} alt={spot.name} className="rounded" />
            </div>
          ) : (
            <Fragment key={index}></Fragment>
          ),
        )
      ) : (
        <p>No photos available</p>
      )}

      <h3 className="h3 font-bold">{spot.name}</h3>
      <Link href={spot.url} target="blank" className="">
        詳細へ
      </Link>
    </div>
  );
};

export default SpotCard;
