import { FC } from 'react';
import Link from 'next/link';

export const ContentContainer: FC = (props) => {
  return <div className='h-full w-full bg-white'>{props.children}</div>;
};
