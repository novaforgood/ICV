export const CheckboxListWithOther = ({
    options,
    selectedValues,
    onChange,
    name,
    otherLabel = 'Other',
    otherPlaceholder = 'Specify other',
}: {
    options: string[]
    selectedValues: string[]
    onChange: (updatedValues: string[] | undefined) => void
    name: string
    otherLabel?: string
    otherPlaceholder?: string
}) => {
    const otherValue =
        selectedValues.find((val) => val.startsWith('Other: ')) || ''
    const otherText = otherValue.replace('Other: ', '')

    return (
        <div>
            {options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        value={option}
                        checked={selectedValues.includes(option)}
                        onChange={(e) => {
                            const updatedValues = e.target.checked
                                ? [...selectedValues, option]
                                : selectedValues.filter(
                                      (item) => item !== option,
                                  )

                            onChange(
                                updatedValues.length > 0
                                    ? updatedValues
                                    : undefined,
                            )
                        }}
                        id={`${name}-${option}`}
                    />
                    <label htmlFor={option}>{option}</label>
                </div>
            ))}

            {/* "Other" Checkbox */}
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={!!otherValue}
                    onChange={(e) => {
                        if (!e.target.checked) {
                            // Remove "Other" when unchecked
                            onChange(
                                selectedValues.filter((e) =>
                                    options.includes(e),
                                ),
                            )
                        } else {
                            // Add "Other" placeholder
                            onChange([...selectedValues, 'Other: '])
                        }
                    }}
                    id={`${name}-other`}
                />
                <label htmlFor={`${name}-other`}>{otherLabel}</label>
            </div>

            {/* "Other" Input Field */}
            {otherValue && (
                <input
                    type="text"
                    placeholder={otherPlaceholder}
                    className="ml-6 border p-2"
                    value={otherText}
                    onChange={(e) => {
                        const updatedText = e.target.value
                        const filteredValues = selectedValues.filter((val) =>
                            options.includes(val),
                        )

                        if (updatedText) {
                            onChange([
                                ...filteredValues,
                                `Other: ${updatedText}`,
                            ])
                        } else {
                            onChange(filteredValues) // Remove "Other" if input is empty
                        }
                    }}
                />
            )}
        </div>
    )
}

export const CheckboxList = ({
    options,
    selectedValues,
    onChange,
    name,
}: {
    options: string[]
    selectedValues: string[]
    onChange: (updatedValues: string[] | undefined) => void
    name: string
}) => {
    return (
        <>
            {options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        value={option}
                        checked={selectedValues.includes(option)}
                        onChange={(e) => {
                            const updatedValues = e.target.checked
                                ? [...selectedValues, option]
                                : selectedValues.filter(
                                      (item) => item !== option,
                                  )

                            onChange(
                                updatedValues.length > 0
                                    ? updatedValues
                                    : undefined,
                            )
                        }}
                        id={`${name}-${option}`}
                    />
                    <label htmlFor={option}>{option}</label>
                </div>
            ))}
        </>
    )
}

export const RadioWithOther = ({
    options,
    selectedValue,
    onChange,
    name,
    otherLabel = 'Other',
    otherPlaceholder = 'Specify other',
}: {
    options: string[]
    selectedValue: string | undefined
    onChange: (updatedValue: string | undefined) => void
    name: string
    otherLabel?: string
    otherPlaceholder?: string
}) => {
    const otherValue =
        selectedValue && selectedValue.startsWith('Other: ')
            ? selectedValue
            : ''
    const otherText = otherValue.replace('Other: ', '')

    return (
        <div>
            {options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                    <input
                        type="radio"
                        value={option}
                        checked={selectedValue === option}
                        onChange={() => onChange(option)}
                        id={`${name}-${option}`}
                        name={name}
                    />
                    <label htmlFor={option}>{option}</label>
                </div>
            ))}

            {/* "Other" Radio */}
            <div className="flex items-center space-x-2">
                <input
                    type="radio"
                    value="Other"
                    checked={otherValue !== ''}
                    onChange={() => onChange('Other: ')}
                    id={`${name}-other`}
                    name={name}
                />
                <label htmlFor={`${name}-other`}>{otherLabel}</label>
            </div>

            {/* "Other" Input Field */}
            {otherValue && (
                <input
                    type="text"
                    placeholder={otherPlaceholder}
                    className="ml-6 border p-2"
                    value={otherText}
                    onChange={(e) => {
                        const updatedText = e.target.value
                        if (updatedText) {
                            onChange(`Other: ${updatedText}`)
                        } else {
                            onChange(undefined) // Remove "Other" if input is empty
                        }
                    }}
                />
            )}
        </div>
    )
}

export const RadioChoice = ({
    options,
    selectedValue,
    onChange,
    name,
}: {
    options: string[]
    selectedValue: string
    onChange: (updatedValue: string | undefined) => void
    name: string
}) => {
    return (
        <>
            {options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                    <input
                        type="radio"
                        value={option}
                        checked={selectedValue === option}
                        onChange={() => onChange(option)}
                        id={`${name}-${option}`}
                        name={name}
                    />
                    <label htmlFor={option}>{option}</label>
                </div>
            ))}
        </>
    )
}
