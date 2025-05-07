<div className="relative">
  <Dropdown
    className="w-full"
    options={users}
    onChange={(option) => handleSelect(option.value)}
    placeholder="Select a user"
    controlClassName="flex items-center justify-between border border-gray-300 rounded-md px-4 py-2 bg-white w-full hover:border-neutral-400"
    menuClassName="absolute w-full mt-1 border border-gray-300 rounded-md bg-white shadow-lg z-50 max-h-60 overflow-auto"
    placeholderClassName="text-gray-500"
    arrowClosed={
      <Symbol symbol="keyboard_arrow_down" className="text-neutral-900" />
    }
    arrowOpen={
      <Symbol symbol="keyboard_arrow_up" className="text-neutral-900" />
    }
  />
</div>;
