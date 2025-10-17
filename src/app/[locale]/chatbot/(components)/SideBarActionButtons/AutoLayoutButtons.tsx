import { ArrowDownToLine, ArrowRightToLine } from 'lucide-react'
import CustomActionButton from '../CustomReactFlowComponents/CustomActionButton'

function AutoLayoutButtons({ onLayout }: { onLayout: (direction: "TB" | "LR") => void }) {
    return (
        <>
            {/* <CustomActionButton
                icon={<ArrowDownToLine size={18} />}
                title="Vertical Layout"
                ariaLabel="Arrange nodes vertically"
                onClick={() => onLayout("TB")}
                tooltip="Arrange nodes top to bottom"
                tooltipPosition="right"
                hoverColor="hover:bg-indigo-500"
            /> */}

            <CustomActionButton
                icon={<ArrowRightToLine size={18} />}
                title="Horizontal Layout"
                ariaLabel="Arrange nodes horizontally"
                onClick={() => onLayout("LR")}
                tooltip="Arrange nodes left to right"
                tooltipPosition="right"
                hoverColor="hover:bg-indigo-500"
            />

            <div className="w-10 border-b border-gray-300 my-3"></div>
        </>
    )
}

export default AutoLayoutButtons