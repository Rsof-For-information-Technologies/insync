import { getNodesBounds, getViewportForBounds, useReactFlow } from '@xyflow/react';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';
import CustomActionButton from '../CustomReactFlowComponents/CustomActionButton';
import { toast } from 'sonner';

const IMAGE_WIDTH = 1024;
const IMAGE_HEIGHT = 768;

const downloadImage = (dataUrl: string) => {
    const link = document.createElement('a');
    link.download = `${new Date().getTime()}-chatbot.png`;
    link.href = dataUrl;
    link.click();
}

function DownloadChatbotImageButton() {

    const { getNodes } = useReactFlow()

    const onDownload = () => {
        const nodesBounds = getNodesBounds(getNodes());
        const { x, y, zoom } = getViewportForBounds(
            nodesBounds,
            IMAGE_WIDTH,
            IMAGE_HEIGHT,
            0.5,
            2,
            1,
        )

        const reactFlow = document.querySelector('.react-flow__viewport') as HTMLElement;

        if (!reactFlow) return;

        toPng(reactFlow, {
            backgroundColor: 'white',
            width: IMAGE_WIDTH,
            height: IMAGE_HEIGHT,
            style: {
                width: `${IMAGE_WIDTH}px`,
                height: `${IMAGE_HEIGHT}px`,
                transform: `translate(${x}px, ${y}px) scale(${zoom})`
            } as any,
        }).then(downloadImage).then(() => {
            toast.success('Chatbot image downloaded successfully!');
        }).catch((err) => {
            toast.error('Failed to download image');
        });
    }

    return (
        <CustomActionButton
            icon={<Download size={18} />}
            title="Download Chatbot Image"
            ariaLabel="Download Chatbot Image"
            onClick={onDownload}
            tooltip="Download flow as PNG image"
            tooltipPosition="right"
            hoverColor="hover:bg-gray-800"
        />
    )
}

export default DownloadChatbotImageButton