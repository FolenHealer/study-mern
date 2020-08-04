import React from "react";

export const LinkCard = ({link}) => {
    return (
        <>
            <h2>LINK</h2>
            <p>Your link: <a href={link.to} target='_blank' rel='noopener noreferrer'>{link.to}</a></p>
            <p>From link: <a href={link.from} target='_blank' rel='noopener noreferrer'>{link.from}</a></p>
            <p>Clicks on link: <strong>{link.clicks}</strong></p>
            <p>Create date: <strong>{new Date(link.date).toLocaleDateString()}</strong></p>
        </>
    )
}