import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

interface CircularProgressProps {
  size: number;
  progress: number;
  color: string;
  unfilledColor: string;
  thickness: number;
  textStyle: { fontSize: number; color: string };
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  size,
  progress,
  color,
  unfilledColor,
  thickness,
  textStyle,
}) => {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const cappedProgress = Math.min(progress, 1);
  const [displayedProgress, setDisplayedProgress] = useState(0);

  useEffect(() => {
    const targetProgress = cappedProgress;
    const step = (targetProgress - displayedProgress) / 10;
    let currentProgress = displayedProgress;

    const interval = setInterval(() => {
      currentProgress += step;
      if (step > 0 && currentProgress >= targetProgress) {
        currentProgress = targetProgress;
        clearInterval(interval);
      } else if (step < 0 && currentProgress <= targetProgress) {
        currentProgress = targetProgress;
        clearInterval(interval);
      }
      setDisplayedProgress(currentProgress);
    }, 20);

    return () => clearInterval(interval);
  }, [progress, cappedProgress, displayedProgress]);

  const strokeDashoffset = circumference * (1 - displayedProgress);
  const displayPercentage = Math.round(progress * 100);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          stroke={unfilledColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={thickness}
        />
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={thickness}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
        <SvgText
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={textStyle.fontSize}
          fill={textStyle.color}
        >
          {`${displayPercentage}%`}
        </SvgText>
      </Svg>
    </View>
  );
};

export default CircularProgress;
