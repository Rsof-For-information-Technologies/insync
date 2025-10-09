import { getNodesBounds, getViewportForBounds, useReactFlow } from '@xyflow/react';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';

const IMAGE_WIDTH = 1024;
const IMAGE_HEIGHT = 768;

const downloadImage = (dataUrl: string) => {
    const link = document.createElement('a');
    link.download = `${new Date()}-chatbot.png`;
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
        }).then(downloadImage);
    }

    return (
        <button
            onClick={onDownload}
            title="Download Chatbot Image"
            aria-label='Download Chatbot Image'
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-800 hover:text-white transition"
        >
            <Download size={18} />
        </button>
    )
}

export default DownloadChatbotImageButton