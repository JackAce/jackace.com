require 'rake'

task :build do
    sh 'rm _data/roulette-systems.json'
    sh 'rm json/roulette-systems.json'

    sh "jq -sc \'add\' " \
            "data-composite/roulette-systems-2019.json " \
            "data-composite/roulette-systems-2020.json " \
            "data-composite/roulette-systems-2021.json " \
            "data-composite/roulette-systems-2022.json " \
            "data-composite/roulette-systems-2023.json " \
            "data-composite/roulette-systems-2024.json " \
            "data-composite/roulette-systems-2025.json " \
            "> _data/roulette-systems.json"

    sh "cp _data/roulette-systems.json json/roulette-systems.json"

    sh 'touch gambling/roulette/systems/index-static.html'
    sh 'touch gambling/roulette/systems/error-check.html'
end
