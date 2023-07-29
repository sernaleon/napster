import ScheduleDayMetadata from "../core/ScheduleDayMetadata";


class MetadataToTableMapper {
    private static readonly Keys: string[] = [
        "Score",
        "Nap Count",
        "Nap Hours",
        "Awake Hours",
        "Night Hours",
        "Sleep Hours",
        "06:00",
        "06:30",
        "07:00",
        "07:30",
        "08:00",
        "08:30",
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00"
    ];

    public static ToScheduleTable(metadatas: ScheduleDayMetadata[]): string[][] {
        const result: string[][] = [];

        // Write header
        result[0] = ["", ...metadatas.map((_, i) => `Schedule ${i + 1}`)];

        // Write keys and values
        for (let i = 0; i < MetadataToTableMapper.Keys.length; i++) {
            const key = MetadataToTableMapper.Keys[i];
            result[i + 1] = [key, ...metadatas.map(metadata => MetadataToTableMapper.getValue(metadata, i))];
        }

        return result;
    }

    private static getValue(metadata: ScheduleDayMetadata, index: number): string {
        if (index >= 0 && index < 6) {
            switch (index) {
                case 0:
                    return metadata.Score.toString();
                case 1:
                    return metadata.NumberOfNaps.toString();
                case 2:
                    return metadata.NapHours.toString();
                case 3:
                    return metadata.AwakeHours.toString();
                case 4:
                    return metadata.NightHours.toString();
                case 5:
                    return metadata.TotalSleepHours.toString();
                default:
                    throw new Error("Unreachable error")
            }
        } else {
            return metadata.ActivitiesIn30MinuteSpans[index - 6] || "";
        }
    }
}

export default MetadataToTableMapper;