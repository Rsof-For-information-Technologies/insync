import useChatbotDarkBgStore from '@/store/chatbotDarkBg.store';
import { Panel } from '@xyflow/react';
import { MoonIcon, Sun } from 'lucide-react';

function DarkAndLightMode() {
    const { isDarkBg, toggleMode } = useChatbotDarkBgStore();

    return (
        <Panel position='top-right'>
            {isDarkBg ? (
                <button
                    onClick={toggleMode}
                    className='bg-gray-500 p-2 rounded-full shadow-md'
                >
                    <Sun className='w-5 h-5 text-yellow-400' />
                </button>
            ) : (
                <button
                    onClick={toggleMode}
                    className='bg-gray-300 p-2 rounded-full shadow-md'
                >
                    <MoonIcon className='w-5 h-5 text-gray-800' />
                </button>
            )}
        </Panel>
    )
}

export default DarkAndLightMode