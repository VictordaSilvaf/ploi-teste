/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import {  updatedPipeline } from "../api/pipeline/pipelineApi";
import { InvisibleInput } from './InvisibleInput'



interface PropsPipelineKanban {
    pipelineItem: { name: string; id: string; sort: number; enterprise_id: number, environment_id: number }
}
export function PipelineTitle(props: PropsPipelineKanban) {
   

    const [name, setName] = useState<string>(props.pipelineItem.name);
    

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            
            await updatedPipeline(props.pipelineItem.id, name, props.pipelineItem.sort, props.pipelineItem.enterprise_id, props.pipelineItem.environment_id);

        } catch (error) {
            console.log(error);
        }
    };


    return (
        <form className="relative group focus-within:group" onSubmit={(e) => handleSubmit(e)}>
            <InvisibleInput onBlur={(e) => handleSubmit(e)} className="font-semibold text-gray-900" value={name} setValue={setName} />
            
            
        </form>
    )
}