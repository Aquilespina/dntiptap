export interface GuestVariable {
    key: string;
    label: string;
}

export interface ParsedGuestVariables {
    defaultVariables: GuestVariable[];
    additionalVariables: GuestVariable[];
}

export const parseGuestVariables = (
    configString: string,
): ParsedGuestVariables => {
    const defaultKeys = ["name", "email", "additional_guests"];

    try {
        const parsed = JSON.parse(configString);

        if (!Array.isArray(parsed)) {
            console.error("Config must be an array.");
            return {
                defaultVariables: [],
                additionalVariables: [],
            };
        }

        const allVariables: GuestVariable[] = parsed
            .filter(
                (item) =>
                    typeof item === "object" &&
                    item !== null &&
                    "key" in item &&
                    "label" in item,
            )
            .map((item: any) => ({
                key: `@${item.key}`,
                label: item.label ?? item.key,
            }));

        const defaultVariables = allVariables.filter((v) =>
            defaultKeys.includes(v.key.replace("@", "")),
        );

        const additionalVariables = allVariables.filter(
            (v) => !defaultKeys.includes(v.key.replace("@", "")),
        );

        return {
            defaultVariables,
            additionalVariables,
        };
    } catch (e) {
        console.error("Error parsing config:", e);
        return {
            defaultVariables: [],
            additionalVariables: [],
        };
    }
};
