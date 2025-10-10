import { ShadCnButton } from '@/components/shadCn/ui/button';
import { ButtonEdge } from '@/components/shadCn/ui/Chatbot/ButtonEdge';
import { EdgeProps, useReactFlow } from '@xyflow/react';
import { RxCross2 } from 'react-icons/rx';

const CustomEdge = ({ id, data, ...props }: EdgeProps) => {
    const { deleteElements } = useReactFlow();

    return (
        <ButtonEdge id={id} {...props}>
            <ShadCnButton onClick={() => { deleteElements({ edges: [{ id }] }) }} size="icon" variant="outline" className='rounded-full shadow-md'>
                <RxCross2 size={16} />
            </ShadCnButton>
        </ButtonEdge>
    );
};

export default CustomEdge;
