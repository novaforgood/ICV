'use client'

import { useState } from 'react'

interface ToggleProps {
    defaultChecked?: boolean
    disabled?: boolean
    onChange?: (checked: boolean) => void
}

const Toggle = ({
    defaultChecked = false,
    disabled = false,
    onChange,
}: ToggleProps) => {
    const [isChecked, setIsChecked] = useState(defaultChecked)

    const handleChange = () => {
        if (!disabled) {
            const newValue = !isChecked
            setIsChecked(newValue)
            onChange?.(newValue)
        }
    }

    return (
        <button
            type="button"
            role="switch"
            aria-checked={isChecked}
            disabled={disabled}
            onClick={handleChange}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isChecked ? 'bg-blue-600' : 'bg-gray-200'
            } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isChecked ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    )
}

function ToggleButton() {
    return (
        <div className="space-y-4">
            <label className="flex items-center space-x-2">
                <Toggle defaultChecked={false} disabled={true} />
                <span className="label-text">Disabled, Unchecked</span>
            </label>
            <label className="flex items-center space-x-2">
                <Toggle defaultChecked={true} disabled={true} />
                <span className="label-text">Disabled, Checked</span>
            </label>
        </div>
    )
}

export default ToggleButton
