import * as React  from 'react';
// import styles from './SinglePageApp.module.scss';
import { ISinglePageAppProps } from './ISinglePageAppProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Sorters from "./Sorters";
import SearchInput from "./SearchInput";
import { WidgetCard } from "./WidgetCard";
import IWidget from "../interfaces/IWidget";
import widgets from "../mock-data/widgets";
import { genericSort } from "../utils/genericSort";
import { genericSearch } from "../utils/genericSearch";
import { genericFilter } from "../utils/genericFilter";
import { Filters } from "./Filters";
import IFilter from "../interfaces/IFilter";
import ISorter from "../interfaces/ISorter";


export default class SinglePageApp extends React.Component<ISinglePageAppProps, {}> {
  
  public render(): React.ReactElement<ISinglePageAppProps> {
  
    const [query, setQuery] = React.useState<string>("");
    const [activeSorter, setActiveSorter] = React.useState<ISorter<IWidget>>({
      property: "title",
      isDescending: true,
    });
    const [activeFilters, setActiveFilters] =React. useState<Array<IFilter<IWidget>>>(
      []
    );
  const resultWidgets = widgets
    .filter((widget) =>
      genericSearch<IWidget>(widget, ["title", "description"], query)
    )
    .filter((widget) => genericFilter<IWidget>(widget, activeFilters))
    .sort((widgetA, widgetB) =>
      genericSort<IWidget>(widgetA, widgetB, activeSorter)
    );
    return (
      <div className="container mx-auto my-2">
      <div className="my-3">
        <i>
          From the blog post{" "}
        
          .
        </i>
      </div>
      <SearchInput onChangeSearchQuery={(query) => setQuery(query)} />
      <Sorters<IWidget>
        object={widgets[0]}
        onChangeSorter={(property, isDescending) => {
          setActiveSorter({
            property,
            isDescending,
          });
        }}
      />
      <Filters<IWidget>
        object={widgets[0]}
        filters={activeFilters}
        onChangeFilter={(changedFilterProperty, checked, isTruthyPicked) => {
          checked
            ? setActiveFilters([
                ...activeFilters.filter(
                  (filter) => filter.property !== changedFilterProperty
                ),
                { property: changedFilterProperty, isTruthyPicked },
              ])
            : setActiveFilters(
                activeFilters.filter(
                  (filter) => filter.property !== changedFilterProperty
                )
              );
        }}
      />
      <h3>Results:</h3>
      {resultWidgets.length > 0 && (
        <div className="row">
          {resultWidgets.map((widget) => (
            <WidgetCard key={widget.id} {...widget} />
          ))}
        </div>
      )}
      {resultWidgets.length === 0 && <p>No results found!</p>}
    </div>
  );
}
}