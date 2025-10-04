"use client"
import AiModelList from '@/shared/AiModelList'
import Image from 'next/image';
import React, { useContext, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader, Lock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext';
import { useUser } from '@clerk/nextjs';
import { useAuth } from "@clerk/nextjs";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function AiMultiModels() {
    const { user } = useUser();
    const { has } = useAuth();
    const [aiModelList, setAiModelList] = useState(AiModelList);
    const { aiSelectedModels, setAiSelectedModels, messages, setMessages } = useContext(AiSelectedModelContext);

    // check plan from Clerk user metadata
    const isUnlimited = (typeof has === 'function')
        ? has({ plan: 'unlimited_plan' })
        : user?.publicMetadata?.plan === 'unlimited_plan';

    const onToggleChange = (model, value) => {
        setAiModelList((prev) =>
            prev.map((m) =>
                m.model === model ? { ...m, enable: value } : m
            )
        )

        setAiSelectedModels((prev) => ({
            ...prev,
            [model]: {
                ...(prev?.[model] ?? {}),
                enable: value
            }
        }))
    }

    const onSelectValue = async (parentModel, value) => {
        setAiSelectedModels(prev => ({
            ...prev,
            [parentModel]: {
                ...(prev?.[parentModel] ?? {}),
                modelId: value
            }
        }))
    }

    return (
        <div className='flex flex-1 h-[75vh] border-b'>
            {aiModelList.map((model, index) => (
                <div
                    key={index}
                    className={`flex flex-col border-r h-full overflow-auto transition-all duration-300
                    ${model.enable ? 'flex-1 min-w-[400px]' : 'w-[100px] flex-none'}`}
                >
                    <div className='flex w-full h-[70px] gap-2 items-center justify-between border-b p-4'>
                        <div className='flex items-center gap-4 w-full'>
                            <Image
                                src={model.icon}
                                alt={model.model}
                                width={24}
                                height={24}
                            />

                            {/* Dropdown visible for any enabled model; premium options disabled unless unlimited */}
                            {model.enable && (
                                <Select
                                    defaultValue={aiSelectedModels?.[model.model]?.modelId}
                                    onValueChange={(value) => onSelectValue(model.model, value)}
                                    disabled={!model.enable}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder={aiSelectedModels?.[model.model]?.modelId} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup className="px-3">
                                            <SelectLabel>Free</SelectLabel>
                                            {model.subModel.map((subModel, idx) =>
                                                subModel.premium === false && (
                                                    <SelectItem key={idx} value={subModel.id}>
                                                        {subModel.name}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectGroup>
                                        <SelectGroup className="px-3">
                                            <SelectLabel>Premium</SelectLabel>
                                            {model.subModel.map((subModel, idx) =>
                                                subModel.premium === true && (
                                                    <SelectItem
                                                        key={idx}
                                                        value={subModel.id}
                                                        disabled={subModel.premium}
                                                    >
                                                        {subModel.name} {subModel.premium && <Lock className='h-4 w-4' />}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                        <div>
                            {model.enable && aiSelectedModels[model.model]?.enable ? (
                                <Switch
                                    checked={model.enable}
                                    disabled={!isUnlimited && model.premium}
                                    onCheckedChange={(v) => onToggleChange(model.model, v)}
                                />
                            ) : (
                                <MessageSquare
                                    className='cursor-pointer h-5 w-5'
                                    onClick={() => onToggleChange(model.model, true)}
                                />
                            )}
                        </div>
                    </div>

                    {/* Upgrade message if premium and not unlimited */}
                    {!isUnlimited && model.premium && model.enable && (
                        <div className='flex items-center justify-center h-full'>
                            <Button><Lock />Upgrade to unlock</Button>
                        </div>
                    )}

                    {/* Chat UI */}
                    {model.enable && aiSelectedModels[model.model]?.enable &&
                        (!model.premium || isUnlimited) && (
                            <div className='flex-1 p-4'>
                                <div className='flex-1 p-4 space-y-2'>
                                    {messages[model.model]?.map((m, i) => (
                                        <div
                                            key={i}
                                            className={`p-2 rounded-md ${m.role === 'user'
                                                ? "bg-blue-100 text-blue-900"
                                                : "bg-gray-100 text-gray-900"
                                                }`}
                                        >
                                            {m.role === 'assistant' && (
                                                <span className='text-sm text-gray-400'>{m.model ?? model.model}</span>
                                            )}
                                            <div className='flex gap-3 items-center'>
                                                {m.content === 'Thinking...' && (
                                                    <>
                                                        <Loader className='animate-spin' />
                                                        <span>Thinking...</span>
                                                    </>
                                                )}
                                            </div>
                                            {m?.content !== 'Thinking...' && m?.content && (
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {m?.content}
                                                </ReactMarkdown>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                </div>
            ))}
        </div>
    )
}

export default AiMultiModels
