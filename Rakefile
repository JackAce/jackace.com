require 'rake'

# Example: rake build
desc "Rolls up all the JSON files into a single JSON file and makes two copies. Usage: `rake build`"
task :build do
    sh "touch _data/roulette-systems.json" # It's ok if the file's not there.
    sh "rm _data/roulette-systems.json"
    sh "touch json/roulette-systems.json" # It's ok if the file's not there.
    sh "rm json/roulette-systems.json"

    # Merge the json files and place in the _data folder. This is needed by Jekyll
    sh "jq -sc \'add\' " \
            "data-disjoint/roulette-systems-2019.json " \
            "data-disjoint/roulette-systems-2020.json " \
            "data-disjoint/roulette-systems-2021.json " \
            "data-disjoint/roulette-systems-2022.json " \
            "data-disjoint/roulette-systems-2023.json " \
            "data-disjoint/roulette-systems-2024.json " \
            "data-disjoint/roulette-systems-2025.json " \
            "> _data/roulette-systems.json"

    # Copy to a folder that Jekyll *DOESN'T* remove. This is needed by DataGrid.js.
    sh "cp _data/roulette-systems.json json/roulette-systems.json"

    # Force the regeneration of these files
    sh "touch gambling/roulette/systems/index-static.html"
    sh "touch gambling/roulette/systems/error-check.html"
end

# Example: rake "json_refresh[roulette-systems-2021.json]"
desc "Reformats a single roulette-system JSON file in place. Usage: `rake \"json_refresh[file_path]\"`"
task :json_refresh, [:file_path] do |t, args|
    if args[:file_path].nil?
        puts "Usage: rake json_refresh[file_path]"
        exit 1
    end

    file_path = args[:file_path]
    # TODO: Make sure this process short circuits if there is an error
    sh "jq 'sort_by(.airDate) | reverse' data-disjoint/#{file_path} > data-disjoint/temp-#{file_path}"
    sh "rm data-disjoint/#{file_path}"
    sh "mv data-disjoint/temp-#{file_path} data-disjoint/#{file_path}"
end

# Example: rake json_refresh_all
desc "Reformats a ALL roulette-system JSON files in place. Usage: `rake json_refresh_all`"
task :json_refresh_all do
    sh "rake \"json_refresh[roulette-systems-2019.json]\""
    sh "rake \"json_refresh[roulette-systems-2020.json]\""
    sh "rake \"json_refresh[roulette-systems-2021.json]\""
    sh "rake \"json_refresh[roulette-systems-2022.json]\""
    sh "rake \"json_refresh[roulette-systems-2023.json]\""
    sh "rake \"json_refresh[roulette-systems-2024.json]\""
    sh "rake \"json_refresh[roulette-systems-2025.json]\""
end
