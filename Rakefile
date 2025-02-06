require 'rake'

task :build do
    sh 'rm _data/roulette-systems.json'
    sh 'rm json/roulette-systems.json'

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

    sh 'touch gambling/roulette/systems/index-static.html'
    sh 'touch gambling/roulette/systems/error-check.html'

    # sh "jq . data-disjoint/roulette-systems-2025.json > data-disjoint/roulette-systems-2025-x.json"
    # sh "rm data-disjoint/roulette-systems-2025.json"
    # sh "mv data-disjoint/roulette-systems-2025-x.json data-disjoint/roulette-systems-2025.json"
end
