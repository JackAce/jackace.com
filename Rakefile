require 'rake'

desc "Rolls up all the JSON files into a single JSON file and makes two copies. Usage: `rake build`"
task :build do
    sh "touch _data/roulette-systems.json" # It's ok if the file's not there.
    sh "rm _data/roulette-systems.json"
    sh "touch json/roulette-systems.json" # It's ok if the file's not there.
    sh "rm json/roulette-systems.json"

    sh "jq -sc \'add\' " \
            "data-disjoint/roulette-systems-2019.json " \
            "data-disjoint/roulette-systems-2020.json " \
            "data-disjoint/roulette-systems-2021.json " \
            "data-disjoint/roulette-systems-2022.json " \
            "data-disjoint/roulette-systems-2023.json " \
            "data-disjoint/roulette-systems-2024.json " \
            "data-disjoint/roulette-systems-2025.json " \
            "> _data/roulette-systems.json"

    sh "cp _data/roulette-systems.json json/roulette-systems.json"

    sh "touch gambling/roulette/systems/index-static.html"
    sh "touch gambling/roulette/systems/error-check.html"
end

desc "Reformats a single JSON file in place. Usage: `rake json_refresh[file_path]`"
task :json_refresh, [:file_path] do |t, args|
    if args[:file_path].nil?
        puts "Usage: rake json_refresh[file_path]"
        exit 1
    end

    file_path = args[:file_path]
    # TODO: Make sure this process short circuits if there is an error
    sh "jq . #{file_path} > temp-#{file_path}"
    sh "rm #{file_path}"
    sh "mv temp-#{file_path} #{file_path}"
end