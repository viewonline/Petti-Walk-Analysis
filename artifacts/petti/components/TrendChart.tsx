import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { TrendPoint, OPTIMAL_ROM } from "@/data/mockData";

interface TrendChartProps {
  data: TrendPoint[];
}

const WIDTH = Dimensions.get("window").width - 64;
const HEIGHT = 120;

export function TrendChart({ data }: TrendChartProps) {
  const colors = useColors();

  if (!data || data.length < 2) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.surfaceContainerLow }]}>
        <Text style={{ color: colors.mutedForeground }}>데이터가 없습니다</Text>
      </View>
    );
  }

  const values = data.map((d) => d.rom);
  const minV = Math.min(...values) - 10;
  const maxV = Math.max(...values) + 10;
  const range = maxV - minV;

  const getX = (i: number) => (i / (data.length - 1)) * WIDTH;
  const getY = (v: number) => HEIGHT - ((v - minV) / range) * HEIGHT;

  const pathD = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.rom)}`)
    .join(" ");

  const optMinY = getY(OPTIMAL_ROM.min);
  const optMaxY = getY(OPTIMAL_ROM.max);

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceContainerLow }]}>
      <Text style={[styles.title, { color: colors.foreground }]}>경과 추이</Text>
      <View style={{ height: HEIGHT + 24, width: WIDTH }}>
        <svg
          width={WIDTH}
          height={HEIGHT}
          style={{ overflow: "visible" } as any}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        >
          <rect
            x={0}
            y={optMaxY}
            width={WIDTH}
            height={optMinY - optMaxY}
            fill={colors.primaryFixed}
            opacity={0.3}
            rx={4}
          />
          <path
            d={pathD}
            stroke={colors.primary}
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {data.map((d, i) => (
            <circle
              key={i}
              cx={getX(i)}
              cy={getY(d.rom)}
              r={5}
              fill={colors.card}
              stroke={colors.primary}
              strokeWidth={2}
            />
          ))}
        </svg>
        <View style={styles.xLabels}>
          {data.map((d, i) => (
            <Text
              key={i}
              style={[styles.xLabel, { color: colors.mutedForeground }]}
            >
              {d.date}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
  },
  xLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  xLabel: {
    fontSize: 10,
    fontWeight: "500",
  },
  empty: {
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 80,
  },
});
