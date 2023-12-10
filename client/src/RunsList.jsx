import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

export function RunsList() {
    const {activities, user} = useOutletContext();

    const activities_list = activities ? activities.filter(activity => activity['owner'] == user['id']).filter(activity => activity['geojson'].hasOwnProperty('features') && activity['geojson']['features'][0] != null).map(activity =>
        <li>
            {activity['geojson']['features'][0]['properties']['name']}
        </li>
    ) : null;

    return (
        <>
            <ul>
                {activities_list}
            </ul>
        </>
    );
}