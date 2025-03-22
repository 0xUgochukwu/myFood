import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';


function CustomIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  size?: number;
  style?: object;
}) {
  return <FontAwesome size={20} {...props} />;
}

function CustomIcon6(props: {
  name: React.ComponentProps<typeof FontAwesome6>['name'];
  color: string;
  size?: number;
  style?: object;
}) {
  return <FontAwesome6 size={20} {...props} />;
}

export {
  CustomIcon,
  CustomIcon6
}

