import React from "react";
import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { TrendPoint } from "@/data/mockData";

interface TrendChartProps {
  data: TrendPoint[];
}

const CHART_HEIGHT = 140;

function computeSummary(data: TrendPoint[]): string {
  if (data.length < 2) return "";
  const first = data[0];
  const last = data[data.length - 1];

  const romChange = ((last.rom - first.rom) / first.rom) * 100;
  const bcsChange = ((last.bcs - first.bcs) / first.bcs) * 100;

  const romDir = romChange >= 0 ? "개선" : "감소";
  const bcsDir = bcsChange >= 0 ? "증가" : "감소";

  const weeks = Math.round(data.length * 2);

  return `${weeks}주간 BCS ${Math.abs(bcsChange).toFixed(0)}% ${bcsDir}, Stifle ROM ${Math.abs(romChange).toFixed(0)}% ${romDir}`;
}

export function TrendChart({ data }: TrendChartProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get("window").width;
  const WIDTH = screenWidth - 80;

  if (!data || data.length < 2) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.surfaceContainerLow }]}>
        <Text style={{ color: colors.mutedForeground }}>데이터가 없습니다</Text>
      </View>
    );
  }

  const romValues = data.map((d) => d.rom);
  const bcsValues = data.map((d) => d.bcs);

  const romMin = Math.min(...romValues) - 8;
  const romMax = Math.max(...romValues) + 8;
  const romRange = romMax - romMin;

  const bcsMin = Math.min(...bcsValues) - 0.3;
  const bcsMax = Math.max(...bcsValues) + 0.3;
  const bcsRange = bcsMax - bcsMin;

  const getX = (i: number) => (i / (data.length - 1)) * WIDTH;
  const getRomY = (v: number) =>
    CHART_HEIGHT - ((v - romMin) / romRange) * CHART_HEIGHT;
  const getBcsY = (v: number) =>
    CHART_HEIGHT - ((v - bcsMin) / bcsRange) * CHART_HEIGHT;

  const romPath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getRomY(d.rom)}`)
    .join(" ");

  const bcsPath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getBcsY(d.bcs)}`)
    .join(" ");

  const summary = computeSummary(data);

  const isWeb = Platform.OS === "web";

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceContainerLow }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          경과 추이
        </Text>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.legendLabel, { color: colors.mutedForeground }]}>
              Stifle ROM
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.secondary }]} />
            <Text style={[styles.legendLabel, { color: colors.mutedForeground }]}>
              BCS
            </Text>
          </View>
        </View>
      </View>

      {isWeb ? (
        <View style={{ height: CHART_HEIGHT + 28, width: WIDTH }}>
          <svg
            width={WIDTH}
            height={CHART_HEIGHT}
            style={{ overflow: "visible" } as any}
            viewBox={`0 0 ${WIDTH} ${CHART_HEIGHT}`}
          >
            <path
              d={romPath}
              stroke={colors.primary}
              strokeWidth={2.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {data.map((d, i) => (
              <circle
                key={`rom-${i}`}
                cx={getX(i)}
                cy={getRomY(d.rom)}
                r={4.5}
                fill={colors.card}
                stroke={colors.primary}
                strokeWidth={2}
              />
            ))}
            <path
              d={bcsPath}
              stroke={colors.secondary}
              strokeWidth={2.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="6 3"
            />
            {data.map((d, i) => (
              <circle
                key={`bcs-${i}`}
                cx={getX(i)}
                cy={getBcsY(d.bcs)}
                r={4.5}
                fill={colors.card}
                stroke={colors.secondary}
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
      ) : (
        <View style={{ height: CHART_HEIGHT + 28, width: WIDTH }}>
          <svg
            width={WIDTH}
            height={CHART_HEIGHT}
            style={{ overflow: "visible" } as any}
            viewBox={`0 0 ${WIDTH} ${CHART_HEIGHT}`}
          >
            <path
              d={romPath}
              stroke={colors.primary}
              strokeWidth={2.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {data.map((d, i) => (
              <circle
                key={`rom-${i}`}
                cx={getX(i)}
                cy={getRomY(d.rom)}
                r={4.5}
                fill={colors.card}
                stroke={colors.primary}
                strokeWidth={2}
              />
            ))}
            <path
              d={bcsPath}
              stroke={colors.secondary}
              strokeWidth={2.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="6 3"
            />
            {data.map((d, i) => (
              <circle
                key={`bcs-${i}`}
                cx={getX(i)}
                cy={getBcsY(d.bcs)}
                r={4.5}
                fill={colors.card}
                stroke={colors.secondary}
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
      )}

      {summary ? (
        <View style={[styles.summaryBox, { backgroundColor: colors.surfaceContainer }]}>
          <Text style={[styles.summaryText, { color: colors.primary }]}>
            {summary}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    gap: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
  },
  legend: {
    flexDirection: "row",
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 11,
    fontWeight: "500",
  },
  xLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  xLabel: {
    fontSize: 10,
    fontWeight: "500",
  },
  summaryBox: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  summaryText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 18,
  },
  empty: {
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 80,
  },
});
