import React, { Component } from 'react'
import FilterApplyButton from './FilterApplyButton'
import FilterCancelButton from './FilterCancelButton'
import FilterResetLink from './FilterResetLink'

class FilterPanel extends Component {
  render() {
    const { applyFilters, resetFilters } = this

    let containerClass = 'modal bg-athens'
    if (!window.isMobile)
      containerClass = 'overlay z-999 bg-athens overflow-y-auto'

    return (
      <div className="ph3 ph4-l">
        <div className={containerClass}>
          <div className="pa3 bb b--geyser flex justify-between items-center filter-panel-header">
            <div className="flex items-center">
              <h3 className="mb0 mr1 b">Filters</h3>
              <FilterResetLink applyFilters={resetFilters} />
            </div>
            <div>
              <FilterCancelButton
                toggleFilterPanel={this.props.toggleFilterPanel}
              />
              <FilterApplyButton applyFilters={applyFilters} />
            </div>
          </div>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default FilterPanel
