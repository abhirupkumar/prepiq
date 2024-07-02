import React from 'react'

interface PageProps {
    params: {
        interviewId: string
    }
}

const Page = async ({ params }: PageProps) => {
    const { interviewId } = params;
    return (
        <div>

        </div>
    )
}

export default Page;